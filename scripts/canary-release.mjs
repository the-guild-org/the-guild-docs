/* eslint-disable @typescript-eslint/no-var-requires */
import semver from 'semver';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { read as readConfig } from '@changesets/config';
import _readChangesets from '@changesets/read';
import _assembleReleasePlan from '@changesets/assemble-release-plan';
import _applyReleasePlan from '@changesets/apply-release-plan';
import { getPackages } from '@manypkg/get-packages';

const readChangesets = _readChangesets.default;
const assembleReleasePlan = _assembleReleasePlan.default;
const applyReleasePlan = _applyReleasePlan.default;

function getNewVersion(version, type) {
  const gitHash = spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trim();

  return semver.inc(version, `pre${type}`, true, 'alpha-' + gitHash);
}

function getRelevantChangesets(baseBranch) {
  const comparePoint = spawnSync('git', ['merge-base', `origin/${baseBranch}`, 'HEAD'])
    .stdout.toString()
    .trim();
  console.log('compare point', comparePoint);
  const listModifiedFiles = spawnSync('git', ['diff', '--name-only', comparePoint])
    .stdout.toString()
    .trim()
    .split('\n');
  console.log('listModifiedFiles', listModifiedFiles);

  const items = listModifiedFiles.filter(f => f.startsWith('.changeset')).map(f => path.basename(f, '.md'));
  console.log('items', items);

  return items;
}

async function updateVersions() {
  const cwd = process.cwd();
  const packages = await getPackages(cwd);
  const config = await readConfig(cwd, packages);
  const modifiedChangesets = getRelevantChangesets(config.baseBranch);
  const changesets = (await readChangesets(cwd)).filter(change => modifiedChangesets.includes(change.id));

  if (changesets.length === 0) {
    throw new Error('Unable to find any relevant package for canary publishing. Please make sure changesets exists!');
  }

  const releasePlan = assembleReleasePlan(changesets, packages, config, [], false);

  if (releasePlan.releases.length === 0) {
    throw new Error('Unable to find any relevant package for canary releasing. Please make sure changesets exists!');
  }
  for (const release of releasePlan.releases) {
    if (release.type !== 'none') {
      release.newVersion = getNewVersion(release.oldVersion, release.type);
    }
  }

  await applyReleasePlan(
    releasePlan,
    packages,
    {
      ...config,
      commit: false,
    },
    false,
    true
  );
}

updateVersions()
  .then(() => {
    console.info('✅ Done!');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

import test from 'ava';
import path from 'path';
import { homedir } from 'os';
import fs from 'fs';

import getCommitRange from './index';

const fixtures = path.join(process.cwd(), 'test', 'fixtures');

test.before('move git to .git', async () => {
  await fs.renameSync(path.join(fixtures, 'repo-ten-commits', 'git'), path.join(fixtures, 'repo-ten-commits', '.git'));
});

test.after.always('move .git to git', async () => {
  await fs.renameSync(path.join(fixtures, 'repo-ten-commits', '.git'), path.join(fixtures, 'repo-ten-commits', 'git'));
});

test.serial('GET COMMIT RANGE | not a repositrory', async (t) => {
  const cwd = process.cwd();

  await process.chdir(homedir());

  const commits = await getCommitRange({
    path: homedir(),
  });

  t.deepEqual(commits, []);

  await process.chdir(cwd);
});

test.serial('GET COMMIT RANGE | get all commits INCLUDING from and to', async (t) => {
  await process.chdir('test/fixtures/repo-ten-commits');

  const cwd = process.cwd();

  const commits = await getCommitRange({
    path: cwd,
    from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    to: '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
  });

  t.deepEqual(commits, [
    '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
    '90caf4f45547a02c585dfed6639e20288d15c346',
  ]);

  await process.chdir('../../..');
});

test.serial('GET COMMIT RANGE | get all commits EXCLUDING from and to', async (t) => {
  await process.chdir('test/fixtures/repo-ten-commits');

  const cwd = process.cwd();

  const commits = await getCommitRange({
    path: cwd,
    from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    to: '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
    include: false,
  });

  t.deepEqual(commits, [
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
  ]);

  await process.chdir('../../..');
});

test.serial('GET COMMIT RANGE | test not absolute path', async (t) => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
    from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    to: '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
    include: false,
  });

  t.deepEqual(commits, [
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
  ]);
});

test.serial('GET COMMIT RANGE | give me all commits since the beginning', async (t) => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
  });

  t.deepEqual(commits, [
    '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
    '90caf4f45547a02c585dfed6639e20288d15c346',
    '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
    '32b940b014322834966d79b109d2d7adec8e3ea3',
    'd943b4112fa88059a23f15523a58a50a82a128b3',
    '8e4211bc265acbbe1f194936154cb5cc108481ec',
    '4892d8cf98a43d97f64c2168a1a44270d0f01299',
    'd1309a2d49a60f9d67c0c04ce90c7adc7680fdc4',
    '6a820773ef84c57b5c927e4ccf1b4c872601826c',
  ]);
});

test.serial('GET COMMIT RANGE | give me all commits (short hash) since the beginning', async (t) => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
    short: true,
  });

  t.deepEqual(commits, [
    '15be93c',
    'ee1db4e',
    '90caf4f',
    '6bca03f',
    '32b940b',
    'd943b41',
    '8e4211b',
    '4892d8c',
    'd1309a2',
    '6a82077',
  ]);
});

test.serial('GET COMMIT RANGE | return all commit messages', async (t) => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
    type: 'text',
  });

  t.deepEqual(commits, [
    'Feat: thats the 10th commit',
    'Style: thats the 9th commit',
    'Feat: thats the 8th commit',
    'CI: thats the 7th commit',
    'Chore: thats the 6th commit',
    'Chore: thats the fifth commit',
    'Chore: thats the fourth commit',
    'Chore: thats the third commit',
    'Chore: thats the second commit',
    'Initial commit',
  ]);
});

test.serial('GET COMMIT RANGE | return all commit messages within a range', async (t) => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
    type: 'text',
    from: 'ee1db4e',
    to: '4892d8c',
  });

  t.deepEqual(commits, [
    'Style: thats the 9th commit',
    'Feat: thats the 8th commit',
    'CI: thats the 7th commit',
    'Chore: thats the 6th commit',
    'Chore: thats the fifth commit',
    'Chore: thats the fourth commit',
  ]);
});

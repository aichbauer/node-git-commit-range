import path from 'path';
import { homedir } from 'os';
import fs from 'fs';

import getCommitRange from './index';

const fixtures = path.join(process.cwd(), 'test', 'fixtures');

beforeAll(async () => {
  // move git to .git
  await fs.renameSync(path.join(fixtures, 'repo-ten-commits', 'git'), path.join(fixtures, 'repo-ten-commits', '.git'));
});

afterAll(async () => {
  // move .git to git
  await fs.renameSync(path.join(fixtures, 'repo-ten-commits', '.git'), path.join(fixtures, 'repo-ten-commits', 'git'));
});

it('GET COMMIT RANGE | not a repositrory', async () => {
  const cwd = process.cwd();

  await process.chdir(homedir());

  const commits = await getCommitRange({
    path: homedir(),
  });

  expect(commits).toEqual([]);

  await process.chdir(cwd);
});

it('GET COMMIT RANGE | get all commits INCLUDING from and to', async () => {
  await process.chdir('test/fixtures/repo-ten-commits');

  const cwd = process.cwd();

  const commits = await getCommitRange({
    path: cwd,
    from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    to: '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
  });

  expect(commits).toEqual([
    '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
    '90caf4f45547a02c585dfed6639e20288d15c346',
  ]);

  await process.chdir('../../..');
});

it('GET COMMIT RANGE | get all commits EXCLUDING from and to', async () => {
  await process.chdir('test/fixtures/repo-ten-commits');

  const cwd = process.cwd();

  const commits = await getCommitRange({
    path: cwd,
    from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    to: '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
    include: false,
  });

  expect(commits).toEqual([
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
  ]);

  await process.chdir('../../..');
});

it('GET COMMIT RANGE | test not absolute path', async () => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
    from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
    to: '6bca03f01b3b8ad152b7c2562ff92aa48a8d41a5',
    include: false,
  });

  expect(commits).toEqual([
    'ee1db4e07af7a26061f569a3d3dc123007e001c7',
  ]);
});

it('GET COMMIT RANGE | give me all commits since the beginning', async () => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
  });

  expect(commits).toEqual([
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

it('GET COMMIT RANGE | give me all commits (short hash) since the beginning', async () => {
  const commits = await getCommitRange({
    path: 'test/fixtures/repo-ten-commits',
    short: true,
  });

  expect(commits).toEqual([
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

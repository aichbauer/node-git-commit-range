# git-commit-range

[![Build Status](https://travis-ci.org/aichbauer/node-git-commit-range.svg?branch=master)](https://travis-ci.org/aichbauer/node-git-commit-range)
[![Build status](https://ci.appveyor.com/api/projects/status/2o83rprgkyfjoxqv?svg=true)](https://ci.appveyor.com/project/rudolfsonjunior/node-git-commit-range)
[![Coverage Status](https://coveralls.io/repos/github/aichbauer/node-git-commit-range/badge.svg?branch=master)](https://coveralls.io/github/aichbauer/node-git-commit-range?branch=master)

> Get the git commithash within a Range from-to

## Installation

```sh
$ npm i git-commit-range --save
```
or
```sh
$ yarn add git-commit-range
```

## Usage

Returns an array with the commithashes from a specified commit to another specified commit.

```js
const gitCommitRange = require('git-commit-range');

gitCommitRange(); // returns all commits (complete hash) since the beginning of the repo of process.cwd()

gitCommitRange({
  path: 'my/repo',
  from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
  to: '32b940b014322834966d79b109d2d7adec8e3ea3',
  include: false,
}); // returns all commits (complete hash) between from and to EXCLUDING from and to, of the path 'my/repo'

gitCommitRange({
  path: 'my/repo',
  from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
  to: '32b940b014322834966d79b109d2d7adec8e3ea3',
}); // returns all commits (complete hash) between from and to INCLUDING from and to, of the path 'my/repo'

gitCommitRange({
  path: 'my/repo',
  from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
  to: '32b940b014322834966d79b109d2d7adec8e3ea3',
  type: 'text',
}); // returns all commits as text between from and to INCLUDING from and to, of the path 'my/repo'

gitCommitRange({
  path: 'my/repo',
  from: '15be93c31ad87c9ced03ba0b60fc2fb55c977c5c',
  to: '32b940b014322834966d79b109d2d7adec8e3ea3',
  short: true,
}); // returns all commits (short hash) between from and to INCLUDING from and to, of the path 'my/repo'
```

## LICENSE

MIT © Lukas Aichbauer

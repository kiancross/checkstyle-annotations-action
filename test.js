#!/usr/bin/env node
/*
 * Copyright (C) 2021 Kian Cross
 */

const fs = require("fs");

function invertObject(object) {
  return Object.entries(object)
    .reduce((t, [key, value]) => {
      t[value] = key;
      return t;
    }, {});
}

function assertEqual(a, b) {
  if (a !== b) {
    throw new Error(`Expected "${a}" == "${b}"`);
  }
}

const testCases = [
  {
    input: `[ant:checkstyle] [ERROR] /root/Bound.java:7:2: 'import' has incorrect indentation level 1, expected level should be 0. [Indentation]`,
    severity: "ERROR",
    file: "/root/Bound.java",
    line: "7",
    column: "2",
    message: `'import' has incorrect indentation level 1, expected level should be 0.`,
    code: "Indentation",
  }, {
    input: `[WARN] /root/test.java:2:1: The name of the outer type and the file do not match. [OuterTypeFilename]`,
    severity: undefined,
    file: "/root/test.java",
    line: "2",
    column: "1",
    message: `The name of the outer type and the file do not match.`,
    code: "OuterTypeFilename",

  }
];

const root = JSON.parse(fs.readFileSync("problem-matcher.json"));
const matcher = root.problemMatcher[0].pattern[0];
const regexp = new RegExp(matcher.regexp);
const invertedObject = invertObject(matcher);

for (const testCase of testCases) {
  const matches = testCase.input.match(regexp);

  for (let i = 1; i <= 6; i++) {
    const fieldName = invertedObject[i];

    assertEqual(testCase[fieldName], matches[i]);
  }
}

console.log("All tests passed");

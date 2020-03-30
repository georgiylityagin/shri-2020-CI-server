const fse = require('fs-extra');
const Git = require('nodegit');

const baseURL = 'https://github.com/';
const repoPath = './tmp/repository';

const axios = require('axios');
const { Agent } = require('https');
const axiosInstance = axios.create({
  baseURL: 'https://hw.shri.yandex/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.TOKEN}`
  },
  httpsAgent: new Agent({
    rejectUnauthorized: false,
    keepAlive: true
  })
});


// Клонировать репозиторий
const gitClone = async () => {
  const exists = await fse.pathExists(repoPath);
  const repoName = process.conf.repoName;

  if (exists) {
    await fse.remove(repoPath);
  }

  return new Promise((resolve) => {
    resolve(Git.Clone(baseURL + repoName, repoPath));
  });
}

// Получить последний коммит
const getLastCommit = async () => {

  const repo = await Git.Repository.open(repoPath);
  const lastCommit = await repo.getBranchCommit(process.conf.mainBranch);

  return Promise.resolve({
    commitMessage: lastCommit.message(),
    commitHash: lastCommit.sha(),
    branchName: process.conf.mainBranch,
    authorName: lastCommit.author().name()
  });
}

// Проверяет репозиторий на появление новых коммитов и возвращает массив с ними
const getNewCommits = async () => {

  const newCommits = [];

  const repo = await Git.Repository.open(repoPath);
  await repo.fetchAll();
  await repo.mergeBranches(
    process.conf.mainBranch,
    `origin/${process.conf.mainBranch}`
  );

  const lastCommit = await repo.getBranchCommit(process.conf.mainBranch);
  const lastCommitHash = process.conf.lastCommitHash;

  return new Promise(resolve => {
    const history = lastCommit.history(Git.Revwalk.SORT.TIME);
    history.start();

    history.on('commit', commit => {
      if (commit.sha() === lastCommitHash) {
        resolve(newCommits);
        history.removeAllListeners('commit');
      } else {
        newCommits.unshift({
          commitMessage: commit.message(),
          commitHash: commit.sha(),
          branchName: process.conf.mainBranch,
          authorName: commit.author().name()
        });
      }
    });
  });
}


// Запускается через setInterval, добавляет новые коммиты в очередь на сборку
const newCommitsObserver = async () => {
  try {
    const commits = await getNewCommits();

    if (commits.length > 0) {
      for (let i = 0; i < commits.length; i++) {
        await axiosInstance.post('/build/request', commits[i]);
      }
      process.conf.lastCommitHash = commits[commits.length - 1].commitHash;
    }
  } catch (error) {
    console.error(error);
  }
};


const getAllCommits = async () => {

  let globalCommits = [];

  await Git.Repository.open(repoPath).then(async function(repo) {
      let currentBranch = await (await repo.getCurrentBranch()).shorthand();
      var walker = Git.Revwalk.create(repo);
      walker.pushGlob('refs/heads/*');
      return walker.getCommitsUntil(c => true).then(function (commits) {
          var cmts = commits.map(x => ({
              commitHash:  x.sha(),
              commitMessage: x.message(),
              branchName: currentBranch,
              authorName: x.author().name()
          }));
          globalCommits = globalCommits.concat(cmts);
      });
  });

  return Promise.resolve(globalCommits);  
};


module.exports = {
  gitClone,
  getLastCommit,
  newCommitsObserver,
  getAllCommits
}
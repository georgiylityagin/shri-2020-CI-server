const Git = require('../git-helper/git-helper');
const axiosInstance = require('../utils/axiosInstance');


// Получение сохраненных настроек
exports.getSettings = async (req, res) => {

  try {
    const settings = await axiosInstance.get('/conf');

    const sendData = settings.data
    ? settings.data.data
    : '';

    if (sendData) {
      process.conf.repoName = sendData.repoName;
      process.conf.mainBranch = sendData.mainBranch;
    }

    res.status(200).json({
      data: sendData
    });
  } catch (error) {
    console.error(error.message);
    
    res.status(504).json({
      error: 'error',
      message: 'Не удалось получить сохраненный конфиг'
    })
  }
}

// Сохранение настроек
exports.postSettings = async (req, res) => {

  const { repoName, buildCommand, mainBranch, period } = req.body;
  process.conf.repoName = repoName;
  process.conf.mainBranch = mainBranch;

  // Сохраняем настройки
  try {
    await axiosInstance.post('/conf', { repoName, buildCommand, mainBranch, period });
  } catch(error) {
    console.error('Не удалось сохранить новые настройки');

    return res.status(500).json({
      error: 'error',
      message: 'Не удалось сохранить новые настройки'
    });
  }

  // Клонируем репозиторий
  const cloned = await Git.gitClone(repoName, mainBranch);

  if (cloned.result === 'fail') {
    console.error(cloned.error.message);

    return res.status(500).json({
      error: cloned.error,
      message: 'Ошибка при клонировании репозитория'
    });
  }

  
  // Получаем последний коммит
  const lastCommit = await Git.getLastCommit(repoName, mainBranch);

  if (lastCommit.commitHash) {
    process.conf.lastCommitHash = lastCommit.commitHash;
  }

  if (lastCommit.result === 'fail') {
    console.error(lastCommit.error.message);

    return res.status(500).json({
      error: lastCommit.error,
      message: 'Ошибка при получении последнего коммита'
    });
  }

  // Добавляем последний коммит в очередь
  try {
    await axiosInstance.post('/build/request', lastCommit);
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      error: 'error',
      message: 'Ошибка при добавлении последнего коммита в очередь'
    });
  }

  // Если указан период, ставим setInterval
  if (period > 0) {
    clearInterval(process.newCommits);

    process.newCommits = setInterval(Git.newCommitsObserver, period * 60000);
  }

  res.status(200).json({
    result: 'success'
  });
}
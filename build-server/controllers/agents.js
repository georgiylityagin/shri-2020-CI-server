const dataBaseApi = require('../helpers/db-api');

process.conf.agents = [];

exports.notifyAgent = (req, res) => {
  const { body } = req;

  if (!body.port || !req.hostname || !body.available) {
    res.status(400).send('Wrong request body');
    return;
  }

  const notInList = process.conf.agents.every(agent => agent.port !== body.port);

  if (notInList) {
    process.conf.agents.push({port: body.port, host: req.hostname, available: body.available});
    console.log('Update actual list of agents:');
    console.table(process.conf.agents);
  }
  
  res.status(200).send('OK');
}

exports.notifyBuildRes = async (req, res) => {
  const { body } = req;
  const { buildId, success, buildLog, duration, port } = body;

  if ([buildId, success, buildLog, duration, port].includes(undefined)) {
    res.status(400).send('Wrong request body');
    return;
  }

  const agentIndex = process.conf.agents.findIndex(agent => agent.port === port);

  if (agentIndex !== -1) {
    process.conf.agents[agentIndex].available = true;
  }
  
  const result = await dataBaseApi.finishBuild({ buildId, success, buildLog, duration });

  if (!result) {
    res.status(501).send('Not Implemented');
    console.log(`Fail trying to finish build ${buildId}\n`);

    const index = process.conf.buildsList.findIndex(build => build.id === buildId);
    if (index !== -1) {
      process.conf.buildsList[index].status = 'Waiting';
    }
    return;
  } else {
    console.log(`Finish build ${buildId} with status: ${success ? 'success': 'failed'}\n`);
  }

  res.status(200).send('OK');
}
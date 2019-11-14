const chalk = require("chalk");
const AWS = require("aws-sdk");

const getLogStreams = async (component, cloudwatch) => {
  const logGroup = await cloudwatch
    .describeLogStreams({
      logGroupName: "/aws/lambda/" + component.state.name
    })
    .promise();

  return logGroup.logStreams.filter((x, i) => i <= 5);
};

const format = {
  message: x => {
    const time = x.split("\t")[0];
    const id = x.split("\t")[1];
    const type = x.split("\t")[2];
    const message = x.split("\t")[3];

    const fullMessage =
      chalk.bold.green(time) +
      "   " +
      chalk.bold.yellowBright(id) +
      "   " +
      chalk.white(type) +
      "   " +
      chalk.white(message) +
      "\n";

    return fullMessage;
  },

  lambdaInfo: x => {
    return chalk.grey(x) + "\n";
  }
};

const pullOutLogsFromStreams = async (component, cloudwatch, logStreams) => {
  let logs = "";
  for (const item of logStreams) {
    const streamName = item.logStreamName;
    var params = {
      logGroupName: "/aws/lambda/" + component.state.name,
      logStreamName: streamName
    };
    const x = await cloudwatch.getLogEvents(params).promise();
    x.events
      .map(x => x.message)
      .forEach(x => {
        if (x.includes("INFO")) {
          logs = logs + format.message(x);
        } else {
          logs = logs + format.lambdaInfo(x);
        }
      });
  }

  console.log(logs);
};

module.exports = async component => {
  const cloudwatch = new AWS.CloudWatchLogs({
    credentials: component.context.credentials.aws,
    region: "us-east-1"
  });

  console.log(chalk.blue("Getting logs from AWS CloudWatch..."));
  const logStreams = await getLogStreams(component, cloudwatch);
  await pullOutLogsFromStreams(component, cloudwatch, logStreams);
};

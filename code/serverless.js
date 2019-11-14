const { Component } = require("@serverless/core");
const getLogs = require("./src/logger");

const makeLambda = async (component, role) => {
  const lambda = await component.load("@serverless/aws-lambda");
  const lambdaConfig = {
    name: component.context.resourceId(),
    code: "./fn/src",
    handler: "handler.hello",
    role: role
  };

  const output = await lambda(lambdaConfig);
  return output;
};

class MyComponent extends Component {
  async default(inputs) {
    this.context.debug(`Creating resources.`);
    this.context.debug(`Waiting for resources to be provisioned.`);

    const lambda = await makeLambda(
      this,

      inputs.role
    );

    this.state.name = lambda.name;
    await this.save();

    return lambda;
  }

  async remove() {
    const awsLambda = await this.load("@serverless/aws-lambda");
    await awsLambda.remove();
  }

  async logs(inputs) {
    await getLogs(this);
  }
}

module.exports = MyComponent;

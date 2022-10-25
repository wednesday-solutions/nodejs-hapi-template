const guardAgainst = {
  environmentName: process.env.ENVIRONMENT_NAME,

  get ENVIRONMENT_NAME() {
    const environment = this.environmentName;
    if (!environment) {
      throw new Error('ENVIRONMENT_NAME is not set');
    }

    const ValidEnvironmentNames = new Set(['local', 'development', 'prod']);
    if (ValidEnvironmentNames.has(environment)) {
      return environment;
    }

    throw new Error(`Invalid value ENVIRONMENT_NAME = ${environment}`);
  },
};

export default guardAgainst;

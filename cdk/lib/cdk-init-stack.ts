import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EightSleepServiceConstruct, EightSleepStackProps } from '@eight/cdk-constructs';


export class SharableAssetApiStack extends Stack {
  constructor(scope: Construct, id: string, props: EightSleepStackProps) {

    super(scope, id, props);

    const service = new EightSleepServiceConstruct(this, 'SharableAssetApi', {
      deploymentEnv: props.deploymentEnv,
      serviceName: props.serviceName,
      portNumber: props.portNumber,
      memLimitHardMB: props.memLimitHardMB,
      memLimitSoftMB: props.memLimitSoftMB,
      cpuUnits: props.cpuUnits,
      ecrLabel: props.ecrLabel,
    });
  }
}
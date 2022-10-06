#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SharableAssetApiStack } from '../lib/cdk-init-stack';
import { EightSleepEnvironment } from '@eight/cdk-constructs';
import { Tags } from 'aws-cdk-lib';

const env = { account: '466811449561', region: 'us-east-1' };
const serviceName = 'shareable-asset-api';

const app = new cdk.App();
const staging = new SharableAssetApiStack(app, `staging-${serviceName}`, {
  env: env,
  serviceName: serviceName,
  deploymentEnv: EightSleepEnvironment.STAGING,
  portNumber: 8900,
  memLimitHardMB: 2048,
  memLimitSoftMB: 1024,
  cpuUnits: 1024,
  internetFacing: true,
  // Only set ecrLabel directly if you want to keep a revision that is not current or latest
  // ecrLabel: "900f457753bbaa1ff426d44364dac6b0c4504b0a",
});
Tags.of(staging).add('Environment', EightSleepEnvironment.STAGING)

const production = new SharableAssetApiStack(app, `production-${serviceName}`, {
  env: env,
  serviceName: serviceName,
  deploymentEnv: EightSleepEnvironment.PRODUCTION,
  ecsCluster: "production-tier-b",
  portNumber: 8900,
  memLimitHardMB: 2048,
  memLimitSoftMB: 1024,
  cpuUnits: 1024,
  internetFacing: true,
  // Only set ecrLabel directly if you want to keep a revision that is not current or latest
  // ecrLabel: "900f457753bbaa1ff426d44364dac6b0c4504b0a",
});
Tags.of(production).add('Environment', EightSleepEnvironment.PRODUCTION)
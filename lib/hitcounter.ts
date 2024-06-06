import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface HitCounterProps {
	downStream: lambda.IFunction;
}

export class HitCounter extends Construct {
	public readonly handler: lambda.Function;
	constructor(scope: Construct, id: string, props: HitCounterProps) {
		super(scope, id);

		const table = new dynamodb.Table(this, 'Hits', {
			partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		this.handler = new lambda.Function(this, 'HitCounterHandlr', {
			runtime: lambda.Runtime.NODEJS_20_X,
			handler: 'hitcounter.handler',
			code: lambda.Code.fromAsset('lambda'),
			environment: {
				DOWNSTREAM_FUNCTION_NAME: props.downStream.functionName,
				HITS_TABLE_NAME: table.tableName,
			},
		});

		table.grantReadWriteData(this.handler);
		props.downStream.grantInvoke(this.handler);
	}
}

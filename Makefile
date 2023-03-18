deploy: 
	cdk synth
	cdk deploy  --profile=personal

destroy: 
	cdk destroy  --profile=personal


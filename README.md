# aws-waf-google-bot-filter

This is a small add-on feature for the [aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations). With the included scanner probe protection sites with varying content (pages that are available a limited time), google bot can be accidentally blocked. Since Google does not provide static IP lists, this lambda uses dns resolve to determine wether an IP address is from google. Ips are stored to a AWS Waf IpSet that can be used to allow googlebot to skip rules.

## Getting started

To use this project, the lambda function needs to be built manually. 

Building requires `yarn` for the dependencies. To install dependencies, run
```
yarn install 
````
After which the lambda can be packaged with
```
gulp build
````
This creates a zip file under `/dist` which needs to uploaded to a S3 bucket manually. This bucket and filename is then used in the cloudformation parameters.

## Integration

After the exising waf stack has been created with the probe protection, use the probe protection blacklist IPSet as a parameter to create the google bot filter stack. To integrate with existing waf template, the template needs to be edited.

Add a new parameter:
```yml
  GoogleBotFilterIpSetId:
    Type: String
```

Add a new resource, the google bot filter rule:
```yml
  GoogleBotFilterRle:
    Type: 'AWS::WAFRegional::Rule'
    Condition: GoogleBotFilterActivated
    Properties:
      Name: !Join [' - ', [!Ref 'AWS::StackName', 'Google bot filter Rule']]
      MetricName: !Join ['', [!Join ['', !Split ['-', !Ref 'AWS::StackName']], 'GoogleBotFilterRule']]
      Predicates:
        - DataId: !Ref GoogleBotFilterIpSetId
          Negated: false
          Type: IPMatch
```

Then edit the existing waf acl
```yml
  WAFWebACL:
    Type: 'AWS::WAFRegional::WebACL'
    Properties:
      Name: !Ref 'AWS::StackName'
      DefaultAction:
        Type: ALLOW
      MetricName: !Join ['', [!Join ['', !Split ['-', !Ref 'AWS::StackName']], 'MaliciousRequesters']]
      Rules:
        - Action:
            Type: ALLOW
          Priority: 10
          RuleId: !Ref WAFWhitelistRule
        - Action:
            Type: ALLOW
          Priority: 9
          RuleId: !Ref GoogleBotFilterRle
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: 'F665'
            reason: This this a blacklist webACL
```


## Limitations

This project only has support for ALB Waf ACLs (WAFRegional). Lambda is also only capable to handle single IP ranges (0.0.0.0/32).

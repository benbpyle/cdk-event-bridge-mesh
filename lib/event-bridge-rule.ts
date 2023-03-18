import { EventBus, Rule, RuleTargetInput } from "aws-cdk-lib/aws-events";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { StateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import * as targets from "aws-cdk-lib/aws-events-targets";

export interface EventBridgeRuleStackProps {
    busOne: EventBus;
    busTwo: EventBus;
    stateMachine: StateMachine;
}

export class EventBridgeRule extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props: EventBridgeRuleStackProps
    ) {
        super(scope, id);
        this.buildBusOneRule(scope, props);
    }

    // private buildCompanyUpdatedRule = (
    //     scope: Construct,
    //     props: EventBridgeRuleStackProps
    // ) => {
    //     const rule = new Rule(this, "CompanyUpdated-Rule", {
    //         eventPattern: {
    //             detailType: ["CompanyChange", "CompanyLocationChange"],
    //         },
    //         ruleName: "company-updated",
    //         eventBus: props.bus,
    //     });

    //     const dlq = new Queue(this, "CompanyUpdatedDLQ");

    //     const role = new Role(this, "CompanyUpdated-Role", {
    //         assumedBy: new ServicePrincipal("events.amazonaws.com"),
    //     });

    //     rule.addTarget(
    //         new targets.SfnStateMachine(props.companyStateMachine, {
    //             input: RuleTargetInput,
    //             deadLetterQueue: dlq,
    //             role: role,
    //         })
    //     );

    //     // {
    //     //     "detail-type": ["CompanyChange", "CompanyLocationChange"]
    //     //   }
    // };

    private buildBusOneRule = (
        scope: Construct,
        props: EventBridgeRuleStackProps
    ) => {
        const rule = new Rule(this, "BusOne-BusTwo-Rule", {
            eventPattern: {
                detailType: ["Busing"],
            },
            ruleName: "bus-two-mesh",
            eventBus: props.busOne,
        });

        const dlq = new Queue(this, "BusOneBusTwoMesh-DLQ");

        const role = new Role(this, "BusOneBusTwoMesh-Role", {
            assumedBy: new ServicePrincipal("events.amazonaws.com"),
        });

        rule.addTarget(
            new targets.EventBus(props.busTwo, {
                deadLetterQueue: dlq,
                role: role,
            })
        );
    };

    // private buildUserAccountUpdatedRule = (
    //     props: EventBridgeRuleStackProps
    // ) => {
    //     const rule = new Rule(this, "UserAccountUpdated-Rule", {
    //         eventPattern: {
    //             detailType: ["UserAccountUpdated"],
    //         },
    //         ruleName: "resource-management-user-account-updated",
    //         eventBus: props.bus,
    //     });

    //     const dlq = new Queue(this, "UserAccountUpdated-DLQ");

    //     const role = new Role(this, "UserAccountUpdated-Role", {
    //         assumedBy: new ServicePrincipal("events.amazonaws.com"),
    //     });

    //     rule.addTarget(
    //         new targets.SfnStateMachine(props.bus, {
    //             input: RuleTargetInput,
    //             deadLetterQueue: dlq,
    //             role: role,
    //         })
    //     );
    // };
}

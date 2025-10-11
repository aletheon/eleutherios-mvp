// 1. Service Registration
interface Service {
  id: string;
  type: 'api';
  title: "Insurance Claims API";
  config: {
    baseUrl: "https://insurance-co.com/api";
    auth: { type: "bearer", token: "..." };
    endpoints: {
      getClaim: "/claims/{claimId}";
      createClaim: "/claims";
      updateClaim: "/claims/{claimId}";
    }
  }
}

// 2. Rule to Service Binding
rule "check claim status" -> Service(InsuranceClaimsAPI, endpoint="getClaim", claimId=params.claimId)

// 3. Runtime Service Execution
class ServiceExecutor {
  async executeServiceRule(rule: ServiceRule, context: any) {
    const service = await this.getService(rule.serviceRef);
    const response = await this.callAPI(service.config, rule.action, context);
    return response;
  }
}
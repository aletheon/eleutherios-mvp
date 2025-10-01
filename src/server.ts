import express from 'express';
import path from 'path';
import type { ApiResponse } from '@/types';
import { 
  socialHousingPolicy, 
  demoActivities 
} from './demo/social-housing-policy';
import { 
  stakeholders, 
  msdHousingRegisterPolicy, 
  homelessPersonSupportPolicy,
  kainaOraIntegrationPolicy,
  multiStakeholderActivities
} from './demo/msd-housing-framework';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Demo API endpoints
app.get('/api/policies/social-housing', (req, res) => {
  const response: ApiResponse<typeof socialHousingPolicy> = {
    data: socialHousingPolicy,
    message: 'Kāinga Ora Social Housing Policy loaded'
  };
  res.json(response);
});

app.get('/api/stakeholders', (req, res) => {
  res.json({ data: stakeholders, message: 'Multi-agency stakeholders loaded' });
});

app.get('/api/policies/msd-housing', (req, res) => {
  res.json({ data: msdHousingRegisterPolicy, message: 'MSD Housing Register Policy loaded' });
});

app.get('/api/policies/homeless-support', (req, res) => {
  res.json({ data: homelessPersonSupportPolicy, message: 'Homeless Support Policy loaded' });
});

app.get('/api/policies/kainga-ora-integration', (req, res) => {
  res.json({ data: kainaOraIntegrationPolicy, message: 'Kāinga Ora Integration Policy loaded' });
});

app.get('/api/newsfeed', (req, res) => {
  const response: ApiResponse<typeof multiStakeholderActivities> = {
    data: multiStakeholderActivities,
    message: 'Multi-stakeholder housing activities loaded'
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Kāinga Ora Housing Demo running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the demo`);
});

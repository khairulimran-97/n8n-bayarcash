import {
ICredentialType,
INodeProperties,
} from 'n8n-workflow';

export class BayarcashApi implements ICredentialType {
name = 'bayarcashApi';
displayName = 'Bayarcash API';
documentationUrl = 'https://api.webimpian.support/bayarcash';
properties: INodeProperties[] = [
{
displayName: 'PAT Token',
name: 'patToken',
type: 'string',
typeOptions: {
password: true,
},
default: '',
description: 'Personal Access Token for Bayarcash API',
required: true,
},
{
displayName: 'API URL',
name: 'apiUrl',
type: 'string',
default: 'https://api.console.bayar.cash/v3',
description: 'Base URL for the Bayarcash API',
required: true,
},
];
}

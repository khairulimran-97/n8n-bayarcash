import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeApiError,
} from 'n8n-workflow';

export class Bayarcash implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bayarcash',
		name: 'bayarcash',
		icon: 'file:bayarcash-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Bayarcash API',
		defaults: {
			name: 'Bayarcash',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bayarcashApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Payment Intent',
						value: 'paymentIntent',
					},
					{
						name: 'Portal',
						value: 'portal',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
				],
				default: 'paymentIntent',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'paymentIntent',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a payment intent',
						action: 'Create a payment intent',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get status of a payment intent',
						action: 'Get status of a payment intent',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a payment intent',
						action: 'Delete a payment intent',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'portal',
						],
					},
				},
				options: [
					{
						name: 'List All Portals',
						value: 'list',
						description: 'Get a list of all available portals',
						action: 'List all portals',
					},
					{
						name: 'Get Portal Channels',
						value: 'getChannels',
						description: 'Get all available payment channels for a portal',
						action: 'Get portal channels',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'transaction',
						],
					},
				},
				options: [
					{
						name: 'Get Transaction by ID',
						value: 'getById',
						description: 'Get a transaction by its ID',
						action: 'Get a transaction by ID',
					},
					{
						name: 'List Transactions',
						value: 'list',
						description: 'List all transactions with optional filters',
						action: 'List transactions',
					},
				],
				default: 'getById',
			},
			{
				displayName: 'These transaction endpoints are only available in Bayarcash API v3',
				name: 'apiV3Notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'transaction',
						],
					},
				},
			},
			{
				displayName: 'This payment intent status endpoint is only available in Bayarcash API v3',
				name: 'paymentIntentApiV3Notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'getStatus',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
			},
			{
				displayName: 'This payment intent delete endpoint is only available in Bayarcash API v3',
				name: 'paymentIntentDeleteApiV3Notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'delete',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
			},
			{
				displayName: 'Portal ID',
				name: 'portalId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'getChannels',
						],
						resource: [
							'portal',
						],
					},
				},
				default: '',
				description: 'ID of the portal to get channels for',
				required: true,
			},
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'getById',
						],
						resource: [
							'transaction',
						],
					},
				},
				default: '',
				description: 'ID of the transaction to retrieve (e.g., trx_z88ymJ)',
				required: true,
			},
			{
				displayName: 'Payment Intent ID',
				name: 'paymentIntentId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'getStatus',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'ID of the payment intent to check status (e.g., pi_Yd7wpD)',
				required: true,
			},
			{
				displayName: 'Payment Intent ID',
				name: 'paymentIntentId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'delete',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'ID of the payment intent to delete (e.g., pi_zByPm9)',
				required: true,
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Order Number',
						name: 'order_number',
						type: 'string',
						default: '',
						description: 'Filter transactions by order number',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'New', value: '0' },
							{ name: 'Pending', value: '1' },
							{ name: 'Failed', value: '2' },
							{ name: 'Success', value: '3' },
							{ name: 'Cancelled', value: '4' },
						],
						default: '0',
						description: 'Filter transactions by status',
					},
					{
						displayName: 'Payment Channel',
						name: 'payment_channel',
						type: 'options',
						options: [
							{ name: 'FPX', value: '1' },
							{ name: 'FPX Line of Credit', value: '4' },
							{ name: 'DuitNow Online Banking/Wallets', value: '5' },
							{ name: 'DuitNow QR', value: '6' },
							{ name: 'Boost PayFlex (BNPL From Boost)', value: '8' },
							{ name: 'QRIS Indonesia Online Banking', value: '9' },
							{ name: 'QRIS Indonesia eWallet', value: '10' },
							{ name: 'NETS Singapore', value: '11' },
						],
						default: '1',
						description: 'Filter transactions by payment channel',
					},
					{
						displayName: 'Exchange Reference Number',
						name: 'exchange_reference_number',
						type: 'string',
						default: '',
						description: 'Filter transactions by exchange reference number',
					},
					{
						displayName: 'Payer Email',
						name: 'payer_email',
						type: 'string',
						default: '',
						description: 'Filter transactions by payer email',
					},
				],
				displayOptions: {
					show: {
						operation: [
							'list',
						],
						resource: [
							'transaction',
						],
					},
				},
			},
			{
				displayName: 'Payment Channel',
				name: 'paymentChannel',
				type: 'options',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				options: [
					{ name: 'FPX (Default Payment Channel)', value: 1 },
					{ name: 'FPX Line of Credit', value: 4 },
					{ name: 'DuitNow Online Banking/Wallets', value: 5 },
					{ name: 'DuitNow QR', value: 6 },
					{ name: 'Boost PayFlex (BNPL From Boost)', value: 8 },
					{ name: 'QRIS Indonesia Online Banking', value: 9 },
					{ name: 'QRIS Indonesia eWallet', value: 10 },
					{ name: 'NETS Singapore', value: 11 },
				],
				default: 1,
				description: 'Payment channel ID. By default only FPX channel (1) is activated for new accounts.',
				required: true,
				noDataExpression: false,
			},
			{
				displayName: 'Portal Key',
				name: 'portalKey',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Portal key retrieved from Bayarcash console',
				required: true,
			},
			{
				displayName: 'Order Number',
				name: 'orderNumber',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Unique order number for this payment',
				required: true,
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 0,
				},
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: 0,
				description: 'Amount for the payment (in integer)',
				required: true,
			},
			{
				displayName: 'Payer Name',
				name: 'payerName',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Name of the person making the payment',
				required: true,
			},
			{
				displayName: 'Payer Email',
				name: 'payerEmail',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Email of the person making the payment',
				required: true,
			},
			{
				displayName: 'Payer Telephone Number',
				name: 'payerTelephoneNumber',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Telephone number of the person making the payment (Currently only accepts Malaysia numbers)',
			},
			{
				displayName: 'Callback URL',
				name: 'callbackUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Server to server callback URL (POST method)',
			},
			{
				displayName: 'Return URL',
				name: 'returnUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Server to browser redirect URL (GET method)',
			},
			{
				displayName: 'Payer Bank Code',
				name: 'payerBankCode',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Bank code of the payer',
			},
			{
				displayName: 'Payer Bank Name',
				name: 'payerBankName',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Bank name of the payer',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
			},
			{
				displayName: 'Platform ID',
				name: 'platformId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
			},
			{
				displayName: 'Checksum',
				name: 'checksum',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentIntent',
						],
					},
				},
				default: '',
				description: 'Checksum for verification',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('bayarcashApi');

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'paymentIntent') {
					if (operation === 'create') {
						const paymentChannel = this.getNodeParameter('paymentChannel', i) as number;
						const portalKey = this.getNodeParameter('portalKey', i) as string;
						const orderNumber = this.getNodeParameter('orderNumber', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const payerName = this.getNodeParameter('payerName', i) as string;
						const payerEmail = this.getNodeParameter('payerEmail', i) as string;

						const payerTelephoneNumber = this.getNodeParameter('payerTelephoneNumber', i, '') as string;
						const callbackUrl = this.getNodeParameter('callbackUrl', i, '') as string;
						const returnUrl = this.getNodeParameter('returnUrl', i, '') as string;
						const payerBankCode = this.getNodeParameter('payerBankCode', i, '') as string;
						const payerBankName = this.getNodeParameter('payerBankName', i, '') as string;
						const metadata = this.getNodeParameter('metadata', i, '') as string;
						const platformId = this.getNodeParameter('platformId', i, '') as string;
						const checksum = this.getNodeParameter('checksum', i, '') as string;

						const body: Record<string, any> = {
							payment_channel: paymentChannel,
							portal_key: portalKey,
							order_number: orderNumber,
							amount: amount,
							payer_name: payerName,
							payer_email: payerEmail,
						};

						if (payerTelephoneNumber) {
							body.payer_telephone_number = parseInt(payerTelephoneNumber.replace(/\D/g, ''), 10);
						}
						if (callbackUrl) body.callback_url = callbackUrl;
						if (returnUrl) body.return_url = returnUrl;
						if (payerBankCode) body.payer_bank_code = payerBankCode;
						if (payerBankName) body.payer_bank_name = payerBankName;
						if (metadata) body.metadata = metadata;
						if (platformId) body.platform_id = platformId;
						if (checksum) body.checksum = checksum;

						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'POST',
							body,
							url: `${credentials.apiUrl}/payment-intents`,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					} else if (operation === 'getStatus') {
						const paymentIntentId = this.getNodeParameter('paymentIntentId', i) as string;

						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'GET',
							url: `${credentials.apiUrl}/payment-intents/${paymentIntentId}`,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					} else if (operation === 'delete') {
						const paymentIntentId = this.getNodeParameter('paymentIntentId', i) as string;

						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'DELETE',
							url: `${credentials.apiUrl}/payment-intents/${paymentIntentId}`,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					}
				} else if (resource === 'portal') {
					if (operation === 'list') {
						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'GET',
							url: `${credentials.apiUrl}/portals`,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					} else if (operation === 'getChannels') {
						const portalId = this.getNodeParameter('portalId', i) as string;

						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'GET',
							url: `${credentials.apiUrl}/portals/${portalId}`,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					}
				} else if (resource === 'transaction') {
					if (operation === 'getById') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;

						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'GET',
							url: `${credentials.apiUrl}/transactions/${transactionId}`,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					} else if (operation === 'list') {
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

						// Build query parameters
						const queryParams = Object.entries(filters)
							.filter(([_, value]) => value !== '')
							.map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
							.join('&');

						const url = queryParams
							? `${credentials.apiUrl}/transactions?${queryParams}`
							: `${credentials.apiUrl}/transactions`;

						const options: IHttpRequestOptions = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.patToken}`,
							},
							method: 'GET',
							url,
							json: true,
						};

						const responseData = await this.helpers.httpRequest(options);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					}
				}
			} catch (error) {
				let errorMessage = error.message;
				let statusCode = 500;

				if (error.response) {
					statusCode = error.response.status;

					if (statusCode === 401) {
						errorMessage = 'Authentication failed: Invalid or expired PAT token. Please check your credentials.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 422) {
						errorMessage = 'Validation error: The API could not process your request.';

						if (error.response.data && error.response.data.errors) {
							errorMessage += ' Details: ' + JSON.stringify(error.response.data.errors);
						} else if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 400) {
						errorMessage = 'Bad request: The request was improperly formatted or contained invalid parameters.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 403) {
						errorMessage = 'Forbidden: You do not have permission to access this resource or the payment channel is not enabled for your account.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 404) {
						errorMessage = 'Not found: The requested resource does not exist.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode >= 500) {
						errorMessage = 'Server error: The Bayarcash server encountered an error.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					}
				}

				if (this.continueOnFail()) {
					const executionErrorData = {
						json: {
							error: errorMessage,
							statusCode: statusCode,
							timestamp: new Date().toISOString(),
						},
					};
					returnData.push(executionErrorData);
					continue;
				}

				throw new NodeApiError(this.getNode(), error, { message: `Bayarcash API Error [${statusCode}]: ${errorMessage}` });
			}
		}

		return [returnData];
	}
}

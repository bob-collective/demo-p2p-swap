import * as yup from 'yup';
import { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

export type AddOrderSchemaParams = {
  input?: Partial<MaxAmountValidationParams & MinAmountValidationParams>;
  output?: Partial<MaxAmountValidationParams & MinAmountValidationParams>;
};

export const addOrderSchema = (params: AddOrderSchemaParams) => {
  return yup.object().shape({
    inputTicker: yup.string().required(),
    outputTicker: yup.string().required(),
    inputValue: yup
      .string()
      .requiredAmount('offer')
      .minAmount(params.input as MinAmountValidationParams, 'offer')
      .when(['inputTicker'], {
        is: (inputTicker: string) => inputTicker !== 'BTC',
        then: (schema) => schema.maxAmount(params.input as MaxAmountValidationParams, 'offer')
      }),
    outputValue: yup
      .string()
      .requiredAmount('receive')
      .minAmount(params.output as MinAmountValidationParams, 'offer')
      .when(['outputTicker'], {
        is: (outputTicker: string) => outputTicker !== 'BTC',
        then: (schema) => schema.maxAmount(params.output as MaxAmountValidationParams, 'receive')
      }),
    btcAddress: yup.string().when(['outputTicker'], {
      is: (outputTicker: string) => outputTicker === 'BTC',
      then: (schema) => schema.required('Please enter bitcoin address').address()
    })
  });
};

export type FillOrderSchemaParams = {
  inputValue?: Partial<MaxAmountValidationParams & MinAmountValidationParams>;
  outputValue?: Partial<MaxAmountValidationParams & MinAmountValidationParams>;
};

export const fillOrderSchema = (params: FillOrderSchemaParams, isSellBTC?: boolean) => {
  let baseBtcAddress = yup.string();

  if (isSellBTC) {
    baseBtcAddress = baseBtcAddress.required('Please enter bitcoin address').address();
  }

  return yup.object().shape({
    inputValue: yup
      .string()
      .requiredAmount('offer')
      .minAmount(params?.inputValue as MinAmountValidationParams, 'offer')
      .when(['inputTicker'], {
        is: (inputTicker: string) => inputTicker !== 'BTC',
        then: (schema) => schema.maxAmount(params?.inputValue as MaxAmountValidationParams, 'offer')
      }),
    outputValue: yup
      .string()
      .requiredAmount('receive')
      .minAmount(params?.outputValue as MinAmountValidationParams, 'offer')
      .when(['outputTicker'], {
        is: (outputTicker: string) => outputTicker !== 'BTC',
        then: (schema) => schema.maxAmount(params?.outputValue as MaxAmountValidationParams, 'receive')
      }),
    btcAddress: baseBtcAddress
  });
};

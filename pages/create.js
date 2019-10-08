import Router from 'next/router';

import { Formik, Form } from 'formik';
import { Page, Layout, Card, FormLayout, PageActions } from '@shopify/polaris';
import { TextField, Select } from '@satel/formik-polaris';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import InventoryList from '../components/InventoryList';
import VendorsSelect from '../components/VendorSelect';
import { AppContext } from '../context/index';
import { getToday } from '../utils/date';
import { getTotals } from '../utils/checkout';

const goBack = () => {
  Router.push({
    pathname: '/'
  });
};

const getPayment = ({ items, payment }) => {
  const { subtotal, tax, total } = getTotals(items);

  return {
    ...payment,
    subtotal,
    tax,
    total
  };
};

export default function Index() {
  return (
    <AppContext.Provider
      value={{
        lang: 'en'
      }}
    >
      <Mutation
        mutation={AWS_CREATE_PURCHASE_ORDER}
        context={{ name: 'aws' }}
        onCompleted={data => {
          console.log('complete', data);
        }}
        onError={err => {
          console.log(err);
        }}
      >
        {(createPurchaseOrder, { data }) => (
          <Formik
            initialValues={{
              author: 'Logged User',
              vendor: '',
              invoiceNumber: '',
              date: getToday(),
              items: [],
              payment: {
                type: 'cash',
                tax: 0,
                subtotal: 0,
                total: 0
              }
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const variables = {
                ...values,
                payment: getPayment(values)
              };
              console.log(variables);
              createPurchaseOrder({
                variables
              });
              setSubmitting(false);
            }}
            render={({ values, handleSubmit }) => {
              return (
                <Page
                  title="Create a Purchase"
                  breadcrumbs={[
                    {
                      content: 'Purchases',
                      onAction: goBack
                    }
                  ]}
                >
                  <Form>
                    <Layout>
                      <Layout.Section>
                        <Card sectioned title="Purchase Information">
                          <FormLayout>
                            <FormLayout.Group>
                              <VendorsSelect name="vendor" placeholder="Select one" label="Vendor" />
                              <TextField type="text" label="Invoice" name="invoiceNumber" />
                              <TextField type="date" label="Date" name="date" />
                            </FormLayout.Group>
                          </FormLayout>
                        </Card>
                        <Card sectioned title="Products">
                          <InventoryList data={values.items} />
                        </Card>
                        <Card sectioned title="Payment">
                          <FormLayout>
                            <FormLayout.Group>
                              <Select
                                name="payment.type"
                                label="Where?"
                                options={[
                                  { label: 'Cashier', value: 'cash' },
                                  { label: 'Bank Account', value: 'bank' },
                                  { label: 'Other', value: 'other' }
                                ]}
                              />
                              <TextField multiline type="text" label="Notes" name="payment.notes" />
                            </FormLayout.Group>
                          </FormLayout>
                        </Card>
                      </Layout.Section>
                    </Layout>
                    <PageActions
                      primaryAction={{
                        content: 'Save',
                        onAction: handleSubmit
                      }}
                      secondaryActions={[
                        {
                          content: 'Cancel',
                          onAction: goBack
                        }
                      ]}
                    />
                  </Form>
                </Page>
              );
            }}
          />
        )}
      </Mutation>
    </AppContext.Provider>
  );
}

const AWS_CREATE_PURCHASE_ORDER = gql`
  mutation create($author: String, $vendor: String, $invoiceNumber: String, $date: AWSDate, $items: [ShopifyEzzyPurchaseOrdersProductsInput], $payment: ShopifyEzzyPurchaseOrdersPaymentInput) {
    createShopifyEzzyPurchaseOrders(
      input: {
        vendor: $vendor
        author: $author
        invoiceNumber: $invoiceNumber
        date: $date
        items: $items
        payment: $payment
      }
    ) {
      id
    }
  }
`;

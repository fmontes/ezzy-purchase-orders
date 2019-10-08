import Router from 'next/router';
import gql from 'graphql-tag';
import { DataTable, Page, Layout, Card, FormLayout, Button } from '@shopify/polaris';
import { Formik, Form } from 'formik';
import { Query } from 'react-apollo';
import { TextField } from '@satel/formik-polaris';

import { getToday } from '../utils/date';
import { currencify } from '../utils/currency';

import VendorsSelect from '../components/VendorSelect';

export default function purchaseList() {
  return (
    <Query query={AWS_GET_PURCHASES} context={{ name: 'aws' }}>
      {({ data, loading, error }) => {
        if (loading) return <h3>Loading</h3>;
        if (error) return <div>{error.message}</div>;

        const rows = data.listShopifyEzzyPurchaseOrders.items.map(
          ({ invoiceNumber, vendor, author, payment }) => [
            invoiceNumber,
            vendor,
            currencify(payment.total),
            author
          ]
        );

        return (
          <Page
            title="Purchases"
            primaryAction={{
              content: 'Create',
              onAction: () => {
                Router.push({
                  pathname: '/create'
                });
              }
            }}
          >
            <Layout>
              <Layout.Section secondary>
                <Card sectioned>
                  <Formik
                    initialValues={{
                      vendor: '',
                      invoice: '',
                      date: getToday()
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                      }, 400);
                    }}
                    render={({ values, handleSubmit }) => {
                      return (
                        <Form>
                          <FormLayout>
                            <VendorsSelect name="vendor" placeholder="Select one" label="" />
                            <TextField type="text" label="Invoice" name="invoice" />
                            <TextField type="date" label="Date" name="date" />
                            <Button submit>Filter</Button>
                          </FormLayout>
                        </Form>
                      );
                    }}
                  />
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card sectioned>
                  <DataTable
                    columnContentTypes={['text', 'text', 'numeric', 'text']}
                    rows={rows}
                    headings={['Invoice Number', 'Vendor', 'Total', 'Author']}
                  />
                </Card>
              </Layout.Section>
            </Layout>
          </Page>
        );
      }}
    </Query>
  );
}

const AWS_GET_PURCHASES = gql`
  query list {
    listShopifyEzzyPurchaseOrders(limit: 5) {
      items {
        id
        vendor
        invoiceNumber
        date
        items {
          title
          price
          cost
          totalInventory
          quantity
          id
        }
        author
        payment {
          type
          notes
          subtotal
          tax
          total
          discount
        }
      }
    }
  }
`;

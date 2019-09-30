import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Formik, Form } from 'formik';
import { Page, Layout, Card, FormLayout, PageActions } from '@shopify/polaris';
import { TextField, Select } from '@satel/formik-polaris';

import { AppContext } from '../context/index';
import InventoryList from '../components/InventoryList';

function getToday() {
  const now = new Date();
  const day = ('0' + now.getDate()).slice(-2);
  const month = ('0' + (now.getMonth() + 1)).slice(-2);

  return `${now.getFullYear()}-${month}-${day}`;
}

const VendorsSelect = () => (
  <Query query={GET_VENDORS}>
    {({ data, loading, error }) => {
      if (loading) return <Select label="Vendor" name="vendor" disabled={true} />;
      if (error) return <div>{error.message}</div>;
      let options = data.shop.productVendors.edges.map(({ node }) => {
        return {
          label: node,
          value: node
        };
      });

      return <Select label="Vendor" placeholder="Select one" name="vendor" options={options} />;
    }}
  </Query>
);

export default class Index extends React.Component {
  render() {
    return (
      <AppContext.Provider
        value={{
          lang: 'en'
        }}
      >
        <Formik
          initialValues={{
            vendor: '',
            invoice: '',
            date: getToday(),
            inventory: []
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
          render={({ values, handleSubmit }) => {
            return (
              <Form noValidate>
                <Page title="Create a Purchase" breadcrumbs={[{ content: 'Purchases', url: '/Purchases' }]}>
                  <Layout>
                    <Layout.Section>
                      <Card sectioned title="Purchase Information">
                        <FormLayout>
                          <FormLayout.Group>
                            <VendorsSelect />
                            <TextField type="text" label="Invoice" name="invoice" />
                            <TextField type="date" label="Date" name="date" />
                          </FormLayout.Group>
                        </FormLayout>
                      </Card>
                      <Card sectioned title="Products">
                        <InventoryList data={values.inventory} />
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
                        content: 'Cancel'
                      }
                    ]}
                  />
                </Page>
              </Form>
            );
          }}
        />
      </AppContext.Provider>
    );
  }
}

const GET_VENDORS = gql`
  query GetVendors {
    shop {
      productVendors(first: 100) {
        edges {
          node
        }
      }
    }
  }
`;

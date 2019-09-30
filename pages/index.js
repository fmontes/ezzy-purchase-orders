import { Formik, Form } from 'formik';
import { Page, Layout, Card, FormLayout, PageActions } from '@shopify/polaris';
import { TextField } from '@satel/formik-polaris';

import { AppContext } from '../context/index';
import InventoryList from '../components/InventoryList';

function getToday() {
  const now = new Date();
  const day = ('0' + now.getDate()).slice(-2);
  const month = ('0' + (now.getMonth() + 1)).slice(-2);

  return `${now.getFullYear()}-${month}-${day}`;
}

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
          render={({ values, handleSubmit}) => {
            return (
              <Form noValidate>
                <Page title="Create a Purchase" breadcrumbs={[{ content: 'Purchases', url: '/Purchases' }]}>
                  <Layout>
                    <Layout.Section>
                      <Card sectioned title="Purchase Information">
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField required type="text" label="Vendor" name="vendor" />
                            <TextField required type="text" label="Invoice" name="invoice" />
                            <TextField required type="date" label="Date" name="date" />
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

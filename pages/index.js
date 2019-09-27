import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import InventoryList from '../components/InventoryList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = { open: false, productsSelected: [] };
  render() {
    return (
      <Page>
        <TitleBar
          primaryAction={{
            content: 'Select products',
            onAction: () => this.setState({ open: true })
          }}
        />
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={resources => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />
        <Layout>
          {this.state.productsSelected.length ? (
            <InventoryList products={this.state.productsSelected} />
          ) : (
            <EmptyState
              heading="Create a Purchase Order"
              action={{
                content: 'Select products',
                onAction: () => this.setState({ open: true })
              }}
              image={img}
            >
              <p>Start adding products to your order</p>
            </EmptyState>
          )}
        </Layout>
      </Page>
    );
  }

  handleSelection = ({ selection }) => {
    console.log('selection', selection);
    this.setState({ open: false, productsSelected: selection });
  };
}

export default Index;

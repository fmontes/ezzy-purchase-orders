import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import InventoryList from '../components/InventoryList';
import { AppContext } from '../context/index';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = { open: false, productsSelected: [] };
  render() {
    return (
      <AppContext.Provider
        value={{
          lang: 'en'
        }}
      >
        <Page fullWidth>
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
          {this.state.productsSelected.length ? (
            <InventoryList products={this.state.productsSelected} onDelete={this.onDelete.bind(this)} />
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
        </Page>
      </AppContext.Provider>
    );
  }

  onDelete(id) {
    const products = this.state.productsSelected.filter(product => product.id !== id);
    this.setState({
      ...this.state,
      productsSelected: products
    });
  }

  handleSelection = ({ selection }) => {
    const newItems = selection.filter(
      item => this.state.productsSelected.findIndex(existing => existing.id === item.id) < 0
    );

    const state = {
      open: false
    };

    if (newItems.length) {
      state.productsSelected = [...this.state.productsSelected, ...newItems];
    }

    this.setState(state);
  };
}

export default Index;

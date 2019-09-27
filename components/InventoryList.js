import { DataTable } from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

class InventoryList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = this.props.products.reduce((acc, item) => {
      return [...acc, ...item.variants.map(variant => variant.inventoryItem.id)];
    }, []);

    return (
      <Query query={GET_INVENTORY_BY_ID} variables={{ ids: items }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          const rows = data.nodes.map(item => {
            return [
              item.variant.product.title,
              item.unitCost.amount,
              item.variant.inventoryQuantity,
              item.variant.price
            ];
          });
          console.log(rows)
          return (
            <DataTable
              headings={['Name', 'Cost', 'Current Quantity', 'Price']}
              rows={rows}
              columnContentTypes={['text', 'numeric', 'numeric', 'numeric']}
            />
          );
        }}
      </Query>
    );
  }
}

export default InventoryList;

const GET_INVENTORY_BY_ID = gql`
  query getInventoryByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on InventoryItem {
        unitCost {
          amount
          currencyCode
        }
        id
        variant {
          product {
            title
            vendor
          }
          inventoryQuantity
          price
        }
      }
    }
  }
`;

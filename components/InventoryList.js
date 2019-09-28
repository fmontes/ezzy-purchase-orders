import { Card, TextField, Badge, Checkbox, Button, Layout } from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { AppContext } from '../context/index';

const cellStyle = { borderBottom: 'solid 1px #eee', padding: '1rem' };
const cellHeaderStyle = { ...cellStyle, textAlign: 'left' };

const InventoryListItem = ({ data, onDelete }) => {
  const [title, cost, quanity, price] = data;
  return (
    <tr>
      <td style={{ ...cellStyle, width: '40%' }}>
        {title} <Badge>{quanity}</Badge>
      </td>
      <td style={cellStyle}>
        <TextField placeholder="Cost" type="currency" value={cost} />
      </td>
      <td style={cellStyle}>
        <TextField placeholder="Price" type="currency" value={price} />
      </td>
      <td style={cellStyle}>
        <TextField placeholder="How many?" type="number" />
      </td>
      <td style={cellStyle}>
        <Checkbox />
      </td>
      <td style={cellStyle}>
        <Button outline size="slim" onClick={onDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

function getInventoryItemsId(products) {
  return products.reduce((acc, item) => [...acc, ...item.variants.map(variant => variant.inventoryItem.id)], []);
}

function InventoryList({ products, onDelete }) {
  const items = getInventoryItemsId(products);
  return (
    <AppContext.Consumer>
      {({ lang }) => {
        console.log(lang);
        return (
          <Query query={GET_INVENTORY_BY_ID} variables={{ ids: items }}>
            {({ data, loading, error }) => {
              if (loading) return <div>Loading…</div>;
              if (error) return <div>{error.message}</div>;
              const rows = data.nodes.map(item => [
                item.variant.product.title,
                item.unitCost.amount,
                item.variant.inventoryQuantity,
                item.variant.price
              ]);
              return (
                <Layout>
                  <Layout.Section>
                    <Card
                      sectioned
                      title="Add Purchase"
                      secondaryFooterActions={[{ content: 'Cancel' }]}
                      primaryFooterAction={{ content: 'Process' }}
                    >
                      <table cellSpacing={0} style={{ width: '100%' }}>
                        <thead>
                          <tr>
                            <th style={cellHeaderStyle}>Product</th>
                            <th style={cellHeaderStyle}>Cost</th>
                            <th style={cellHeaderStyle}>Price</th>
                            <th style={cellHeaderStyle}>Quanity</th>
                            <th style={cellHeaderStyle}>Taxed?</th>
                            <th style={cellHeaderStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, i) => (
                            <InventoryListItem
                              data={row}
                              key={i}
                              onDelete={() => {
                                onDelete(data.nodes[i].variant.product.id);
                              }}
                            />
                          ))}
                        </tbody>
                      </table>
                    </Card>
                  </Layout.Section>
                </Layout>
              );
            }}
          </Query>
        );
      }}
    </AppContext.Consumer>
  );
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
            id
          }
          inventoryQuantity
          price
        }
      }
    }
  }
`;

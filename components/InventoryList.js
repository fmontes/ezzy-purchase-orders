import { useState } from 'react';

import gql from 'graphql-tag';


import {
  Badge,
  Button,
  Card,
  SkeletonBodyText,
  Layout,
  SkeletonDisplayText,
  DisplayText,
  TextStyle
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';

import { Checkbox, TextField } from '@satel/formik-polaris';
import { FieldArray } from 'formik';

import { AppContext } from '../context/index';
import { client } from '../pages/_app';
import { currencify } from '../utils/currency';
import { getTotals } from '../utils/checkout';

const cellStyle = { borderBottom: 'solid 1px #eee', padding: '1rem' };
const cellHeaderStyle = { ...cellStyle, textAlign: 'left' };

const InventoryListItem = ({ data, onDelete, index }) => {
  const { cost, price, quantity, taxable, title, totalInventory } = data;

  return (
    <tr>
      <td width="33%" style={cellStyle}>
        {title} <Badge>{totalInventory}</Badge>
      </td>
      <td style={cellStyle}>
        <TextField placeholder="Cost" name={`items.${index}.cost`} type="currency" value={cost} />
      </td>
      <td style={cellStyle}>
        <TextField placeholder="Price" name={`items.${index}.price`} type="currency" value={price} />
      </td>
      <td style={cellStyle}>
        <TextField placeholder="How many?" name={`items.${index}.quantity`} type="number" value={quantity} />
      </td>
      <td align="center" style={cellStyle}>
        <Checkbox name={`items.${index}.taxable`} value={taxable} />
      </td>
      <td style={cellStyle}>
        <Button outline size="slim" onClick={onDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th style={cellHeaderStyle}>Product</th>
        <th style={cellHeaderStyle}>Cost</th>
        <th style={cellHeaderStyle}>Price</th>
        <th style={cellHeaderStyle}>Quanity</th>
        <th style={cellHeaderStyle}>Taxed</th>
        <th style={cellHeaderStyle}>Actions</th>
      </tr>
    </thead>
  );
};

const getInventoryItemsId = products => {
  return products.reduce((acc, item) => [...acc, ...item.variants.map(({ inventoryItem }) => inventoryItem.id)], []);
};

async function getCosts(ids) {
  return client
    .query({
      query: GET_PRODUCT_COST_BY_ID,
      variables: {
        ids
      }
    })
    .then(({ data: { nodes } }) => nodes.map(({ unitCost }) => unitCost.amount));
}

function EmptyInventoryList({ children }) {
  const EmtpyBox = () => (
    <Layout.Section oneThird>
      <SkeletonDisplayText size="small" />
      <br />
      <SkeletonBodyText lines={1} />
    </Layout.Section>
  );

  return (
    <>
      <Card sectioned>
        <Layout>
          <EmtpyBox />
          <EmtpyBox />
          <EmtpyBox />
        </Layout>
      </Card>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>{children}</div>
    </>
  );
}

function InventoryList({ data }) {
  const { subtotal, tax, total } = getTotals(data);

  const [resourcePicker, setResourcePicker] = useState({
    open: false,
    pushInventoryField: () => {}
  });

  const cancelResourcePicker = () => {
    setResourcePicker({
      open: false,
      pushInventoryField: () => {}
    });
  };

  const removeAlreadyAddedProducts = selection => {
    const dataIds = data.map(({ id }) => id);
    return data.length ? selection.filter(({ id }) => !dataIds.includes(id)) : selection;
  };

  return (
    <AppContext.Consumer>
      {({ lang }) => {
        return (
          <>
            <ResourcePicker
              resourceType="Product"
              showVariants={true}
              open={resourcePicker.open}
              onSelection={async ({ selection }) => {
                const costs = await getCosts(getInventoryItemsId(selection));
                const filtered = removeAlreadyAddedProducts(selection);

                filtered.forEach(({ id, title, totalInventory, variants: [{ price, taxable }] }, index) => {
                  resourcePicker.pushInventoryField({
                    cost: costs[index],
                    id,
                    price,
                    quantity: 6,
                    taxable,
                    title,
                    totalInventory
                  });
                });
                cancelResourcePicker();
              }}
              onCancel={cancelResourcePicker}
            />

            <FieldArray
              name="items"
              render={arrayHelpers => {
                const AddButton = () => (
                  <Button
                    outline
                    onClick={() => {
                      setResourcePicker({
                        open: true,
                        pushInventoryField: arrayHelpers.push
                      });
                    }}
                  >
                    Add
                  </Button>
                );

                return data.length ? (
                  <table cellSpacing={0} style={{ width: '100%' }}>
                    <TableHeader />
                    <tbody>
                      {data.map((item, i) => (
                        <InventoryListItem
                          data={item}
                          key={i}
                          index={i}
                          onDelete={() => {
                            arrayHelpers.remove(i);
                          }}
                        />
                      ))}
                      <tr>
                        <td colSpan={3} />
                        <td style={cellStyle} align="right">
                          <TextStyle variation="subdued">Tax:</TextStyle>
                        </td>
                        <td colSpan={2} style={cellStyle} align="right">
                          <TextStyle variation="subdued">{currencify(tax)}</TextStyle>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} />
                        <td style={cellStyle} align="right">
                          <TextStyle variation="subdued">Subtotal:</TextStyle>
                        </td>
                        <td colSpan={2} style={cellStyle} align="right">
                          <TextStyle variation="subdued">{currencify(subtotal)}</TextStyle>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} />
                        <td style={cellStyle} align="right">
                          <DisplayText size="small">Total:</DisplayText>
                        </td>
                        <td colSpan={2} style={cellStyle} align="right">
                          <DisplayText size="small">{currencify(total)}</DisplayText>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" colSpan={6} style={{ paddingTop: '2rem' }}>
                          <AddButton />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <EmptyInventoryList>
                    <AddButton />
                  </EmptyInventoryList>
                );
              }}
            />
          </>
        );
      }}
    </AppContext.Consumer>
  );
}

const GET_PRODUCT_COST_BY_ID = gql`
  query getInventoryByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on InventoryItem {
        unitCost {
          amount
          currencyCode
        }
      }
    }
  }
`;

export default InventoryList;

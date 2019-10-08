import { Select } from '@satel/formik-polaris';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export default function VendorsSelect({name, placeholder, label}) {
  return (
    <Query query={GET_VENDORS}>
      {({ data, loading, error }) => {
        if (loading) return <Select label="Vendor" name={name} disabled={true} />;
        if (error) return <div>{error.message}</div>;
        let options = data.shop.productVendors.edges.map(({ node }) => {
          return {
            label: node,
            value: node
          };
        });

        return <Select label={label} placeholder={placeholder} name={name} options={options} />;
      }}
    </Query>
  );
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

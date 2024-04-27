'use client'

import React from 'react'
import { Alert, Badge, Table } from 'react-bootstrap'

import { type FetchUserAttributesOutput } from 'aws-amplify/auth'

interface Props {
  attributes: FetchUserAttributesOutput | null
}

export default function ShowComponent (props: Props): React.JSX.Element {
  const { attributes } = props

  if (attributes == null) {
    return (
      <Alert variant='warning'>
        Fetching user attributes...
      </Alert>
    )
  }

  return (
    <>
      <Table bordered>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sub</td>
            <td>{attributes.sub}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              {attributes.email}
              {attributes.email_verified === 'true'
                ? (
                <Badge bg='primary' className='ms-3'>Verified</Badge>
                  )
                : (
                <Badge bg='warning' className='ms-3'>Not Verified</Badge>
                  )}
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{attributes.name}</td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>{attributes.birthdate}</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

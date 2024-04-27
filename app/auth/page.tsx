'use client'

import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { type FetchUserAttributesOutput, fetchUserAttributes, updateUserAttributes, deleteUser } from 'aws-amplify/auth'

import ShowComponent from './show'
import UpdateComponent from './update'

export default function App (): React.JSX.Element {
  const { user, signOut } = useAuthenticator((context) => [context.user])
  const [attributes, setAttributes] = useState<FetchUserAttributesOutput | null>(null)

  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false)
  const openUpdateModal = (): void => { setUpdateModalIsOpen(true) }
  const closeUpdateModal = (): void => { setUpdateModalIsOpen(false) }

  useEffect(() => {
    if (user == null) return
    execFetchUserAttributes()
  }, [user])

  const execFetchUserAttributes = (): void => {
    fetchUserAttributes()
      .then((result) => {
        setAttributes(result)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const execUpdateUserAttributes = (attributes: FetchUserAttributesOutput): void => {
    const name = attributes?.name
    if (name == null) {
      toast.error('Name is required')
      return
    }
    const birthdate = attributes?.birthdate
    if (birthdate == null) {
      toast.error('Birthdate is required')
      return
    }
    updateUserAttributes({
      userAttributes: {
        name,
        birthdate
      }
    })
      .then(() => {
        toast.success('User attributes updated')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Failed to update user attributes')
      })
      .finally(() => {
        execFetchUserAttributes()
      })
  }

  if (user == null) {
    return (
      <Alert variant='danger'>
        You are not signed in.
      </Alert>
    )
  }

  return (
    <>
      <ShowComponent attributes={attributes} />
      <UpdateComponent modalIsOpen={updateModalIsOpen} closeModal={closeUpdateModal} initialValues={attributes} execUpdateUserAttributes={execUpdateUserAttributes} />
      <hr />
      <div className='d-flex'>
        <Button variant='primary' className='me-2' onClick={openUpdateModal}>Update</Button>
        <Button variant='secondary' className='me-2' onClick={() => { if (window.confirm('Are you sure you want to sign out?')) signOut?.() }}>Sign Out</Button>
        <Button variant='danger' onClick={() => { if (window.confirm('Are you sure you want to delete your account?')) void deleteUser?.() }}>Delete Account</Button>
      </div>
    </>
  )
}

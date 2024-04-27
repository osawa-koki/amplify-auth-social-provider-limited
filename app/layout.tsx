'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/style.scss'
import '@/styles/menu.scss'

import setting from '@/setting'
import Menu from '@/components/Menu'

import { Amplify } from 'aws-amplify'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/src/aws-exports'

Amplify.configure(awsExports)

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const pathname = usePathname()

  const [currentPage, setCurrentPage] = useState<string | null>(null)

  useEffect(() => {
    const path = window.location.pathname
    setCurrentPage(path)
  }, [pathname])

  return (
    <html lang="ja">
      <head>
        <meta charSet='utf-8' />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <title>{setting.title}</title>
        <meta name='description' content={setting.description} />
        {setting.keywords.length > 0 && (
          <meta name='keywords' content={setting.keywords.join(',')} />
        )}
      </head>
      <body>
        <div id="Wrapper">
          <Authenticator.Provider>
            <Authenticator signUpAttributes={['email', 'name']} socialProviders={['google']}>
              {() => (
                <>
                  <main>
                    {children}
                  </main>
                </>
              )}
            </Authenticator>
            <Menu currentPage={currentPage} />
          </Authenticator.Provider>
          <ToastContainer />
        </div>
        <footer>
          <a
            href='https://github.com/osawa-koki'
            target='_blank'
            rel='noreferrer'
          >
            @osawa-koki
          </a>
        </footer>
      </body>
    </html>
  )
}

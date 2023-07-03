import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        try {
          // Make an API request to your login endpoint with the provided credentials
          const response = await fetch('https://test.mybranzapi.link/sellers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
          })    
          const data = await response.json()
          if (data.success) {
            const user = data.data
            return user
          } else {
            throw new Error(data.message)
          }          
        } catch (error) {
          throw new Error(error)
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token, user, response }) {
      // console.log("session", session)
      // console.log("token", token)
      // console.log("user", user)
      // console.log("response", response)
      // Customize the session object based on your API response
      // session.user = token.user
      return session
    }
  },
  secret: "XUER0VS6jqRoKs4tairvPvrwSQnjNZNXxdFe3krGecY="
})
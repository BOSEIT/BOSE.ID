import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: '5ngxi1b8', 
  dataset: 'production',
  apiVersion: '2024-05-07', 
  useCdn: true, 
})
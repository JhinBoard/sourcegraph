import { map } from 'rxjs/operators'
import { GQL } from '../../types/gqlschema'
import { getPlatformName } from '../util/context'
import { memoizeObservable } from '../util/memoize'
import { getContext } from './context'
import { createAggregateError } from './errors'
import { mutateGraphQL } from './graphql'

/**
 * Create an access token for the current user on the currently configured
 * sourcegraph instance.
 */
export const createAccessToken = memoizeObservable((userID: GQL.ID) =>
    mutateGraphQL({
        ctx: getContext({ repoKey: '' }),
        request: `
        mutation CreateAccessToken($userID: ID!, $scopes: [String!]!, $note: String!) {
            createAccessToken(user: $userID, scopes: $scopes, note: $note) {
                id
                token
            }
        }
        `,
        variables: { userID, scopes: ['user:all'], note: `sourcegraph-${getPlatformName()}` },
        useAccessToken: false,
    }).pipe(
        map(({ data, errors }) => {
            if (!data || !data.createAccessToken || (errors && errors.length > 0)) {
                throw createAggregateError(errors)
            }
            return data.createAccessToken.token
        })
    )
)

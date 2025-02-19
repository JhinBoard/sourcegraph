package graphql

import (
	"context"

	gql "github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend"
)

type CodeIntelligenceRangeConnectionResolver struct {
	ranges           []AdjustedCodeIntelligenceRange
	locationResolver *CachedLocationResolver
}

func (r *CodeIntelligenceRangeConnectionResolver) Nodes(ctx context.Context) ([]gql.CodeIntelligenceRangeResolver, error) {
	var resolvers []gql.CodeIntelligenceRangeResolver
	for _, rn := range r.ranges {
		resolvers = append(resolvers, &CodeIntelligenceRangeResolver{
			r:                rn,
			locationResolver: r.locationResolver,
		})
	}

	return resolvers, nil
}

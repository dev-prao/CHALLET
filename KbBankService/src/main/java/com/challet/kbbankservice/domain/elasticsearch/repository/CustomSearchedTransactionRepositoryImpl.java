package com.challet.kbbankservice.domain.elasticsearch.repository;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.challet.kbbankservice.domain.entity.SearchedTransaction;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomSearchedTransactionRepositoryImpl implements CustomSearchedTransactionRepository {

	private final ElasticsearchClient elasticsearchClient;

	@Override
	public Page<SearchedTransaction> findByAccountIdAndKeyword(Long accountId, String keyword, Pageable pageable) {
		try {
			BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
				.must(mq -> mq.term(t -> t.field("accountId").value(accountId)));

			if (keyword != null && !keyword.isEmpty()) {
				boolQueryBuilder.must(mq -> mq
					.bool(bq -> bq
						.should(sq -> sq.bool(subBq -> subBq
							.must(m -> m.range(r -> r.field("transactionAmount").lt(
								JsonData.fromJson("0"))))
							.must(m -> m.wildcard(wq -> wq.field("deposit").value("*" + keyword + "*")))
						))
						.should(sq -> sq.bool(subBq -> subBq
							.must(m -> m.range(r -> r.field("transactionAmount").gt(
								JsonData.fromJson("0"))))
							.must(m -> m.wildcard(wq -> wq.field("withdrawal").value("*" + keyword + "*")))
						))
					)
				);
			}

			Query query = boolQueryBuilder.build()._toQuery();

			// 거래 날짜를 기준으로 정렬
			SortOptions sortOptions = SortOptions.of(so -> so
				.field(f -> f.field("transactionDate").order(SortOrder.Desc))
			);

			SearchResponse<SearchedTransaction> searchResponse = elasticsearchClient.search(s -> s
					.index("kb_bank_transaction")
					.query(query)
					.sort(sortOptions)
					.from((int) pageable.getOffset())
					.size(pageable.getPageSize()),
				SearchedTransaction.class
			);

			List<SearchedTransaction> content = searchResponse.hits().hits().stream()
				.map(Hit::source)
				.toList();

			long total = searchResponse.hits().total() != null ? searchResponse.hits().total().value() : 0;

			return new PageImpl<>(content, pageable, total);

		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 검색 오류", e);
		}
	}
}


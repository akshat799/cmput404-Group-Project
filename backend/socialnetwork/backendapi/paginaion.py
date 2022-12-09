from rest_framework import pagination


class CustomPagiantor(pagination.PageNumberPagination):
    page_size = 5  # default
    page_size_query_param = "size"
    max_page_size = 10
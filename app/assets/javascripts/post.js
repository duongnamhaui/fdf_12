$(document).ready(function(){
  $(document).on('change','.select-category-parent select',function(){
    var domain_id = $(this).parent().data('domain-id');
    $.ajax({
      url: '/domains/'+ domain_id +'/ads/posts/new',
      type: 'GET',
      data: {category_id: $(this).val()},
      dataType: 'JSON',
      success: function(response) {
        $('.select-category-children select').html('');
        $.each(response.children_categories, function(index, value) {
          $('.select-category-children select').append('<option value="' + value.id + '">' + value.name + '</option>');
        });
      }
    });
  });

  $(document).on('click', '#like', function() {
    $(this).parents('form').submit();
  });

  $(document).on('click', '#submit-review', function(event) {
    if ($('#ads-review').val().length > 255) {
      event.preventDefault();
      swal(I18n.t("ads.post.review.too_long", {number: 255}), "", "error");
    } else if ($('#ads-review').val().length <= 0) {
      event.preventDefault();
      swal(I18n.t("ads.post.review.fail"), "", "error");
    }
  });

  $(document).on('click', '#submit-post', function(){
    $(this).prop('disabled', true);

    var url = $('#new_post').attr('action');
    var title = $('#post-title').val();
    var content = $('#post_content').val();
    var categoryId = $('#post_category_id').children('option:selected').val();
    var mode = $('input[name="post[mode]"]:checked').val();
    var arena = $('input[name="post[arena]"]:checked').val();
    var linkShop = $('#post_link_shop').val();
    var minPrice = $('#post_min_price').val();
    var maxPrice = $('#post_max_price').val();
    var postData = new FormData();

    postData.append('post[title]', title);
    postData.append('post[content]', content);
    postData.append('post[category_id]', categoryId);
    postData.append('post[mode]', mode);
    postData.append('post[arena]', arena);
    postData.append('post[link_shop]', linkShop);
    postData.append('post[min_price]', minPrice);
    postData.append('post[max_price]', maxPrice);
    for (var i = 0, file; file = modifiableFiles[i]; i++) {
      postData.append('post[images_attributes][' + i + '][image]', file);
      postData.append('post[images_attributes][' + i + '][_destroy]', false);
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: postData,
      processData: false,
      contentType: false,
    });
  });
});

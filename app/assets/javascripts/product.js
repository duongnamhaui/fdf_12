$(document).ready(function() {
  $(document).on('keyup', '#quantity_product', function() {
    $('.quantity-products').addClass('fa-floppy-o');
  });
  $(document).on('click', '.submit-quantity-product', function() {
    var id = $(this).data('id');
    var quantity_product = $('#quantity_product').val();
    $.ajax({
      type: 'PUT',
      url : '/carts/' + id,
      dataType: 'script',
      data: {
        edit: true,
        quantity_product: quantity_product
      }
    });
  });
  $('.id_btn_active').on('click', function() {
    statusNow = $(this).val();
    btn = $(this);
    statusChange = (statusNow === 'active') ? 'inactive' : 'active';
    parent = $(this).parent(),
    productId =  parent.children()[0].value,
    $.ajax({
      type: 'PUT',
      url : '/dashboard/shops/' + $('.shop_id').val() + '/products/'+ productId,
      dataType: 'json',
       data: {
        product: {
          status: statusChange
        }
      },
      success: function(data) {
        btn.val(statusChange);
      },
      error: function(error_message) {
        Console.log('error: ' + error_message);
      }
    });
  });
  function load_image(input, klass) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('.' + klass).attr('src', e.target.result);
      }
    reader.readAsDataURL(input.files[0]);
    }
  };
  function choose_image() {
    var file_field;
    $('.choose-avatar').hover(function() {
      $('.choose-avatar label').animate({'width': 'show'}, 400);
    }, function() {
      $('.choose-avatar label').animate({'width': 'hide'}, 400);
    });
    $('.choose-avatar').click(function() {
      file_field = $(this).parent().find('.upload_img');
      file_field.click();
    });
    $('.upload_img').on('change', function() {
      load_image(this, 'product-avatar');
    });
  };

  function validate_form_product() {
    $('.form-product').validate({
      errorPlacement: function (error, element) {
        error.insertBefore(element);
      },
      rules: {
        'product[name]': {
          required: true,
          maxlength: 50
        },
        'product[description]': {
          maxlength: 500
        },
        'product[price]': {
          required: true,
          Regex: "[0-9,]+"
        }
      },
      messages: {
        'product[name]': {
          required: I18n.t('activerecord.errors.models.product.attributes.name.blank'),
          maxlength: I18n.t('activerecord.errors.models.product.attributes.name.too_long')
        },
        'product[description]': {
          maxlength: I18n.t('activerecord.errors.models.product.attributes.description.too_long')
        },
        'product[price]': {
          required: I18n.t('activerecord.errors.models.product.attributes.price.blank'),
        }
      }
    });
    jQuery.validator.addMethod("Regex", function(value, element, param) {
      return value.match(new RegExp("." + param + "$"));
    }, I18n.t('activerecord.errors.models.product.attributes.price.number_valid'));
  }

  function isValidHour() {
    var start_time = '' + $('#product_start_hour_4i').val()
      + $('#product_start_hour_5i').val();
    var end_time = '' + $('#product_end_hour_4i').val()
      + $('#product_end_hour_5i').val();
    if (start_time > end_time) {
      $('label.time-error').html(I18n.t('invalid_hour'));
      return false;
    } else {
      $('label.time-error').html('');
      return true;
    }
  }

  $('#new-edit-product-modal').on('shown.bs.modal', function() {
    $('#hidden_products_size').val($('.product-in-shop').length);
    validate_form_product();
    choose_image();
    $('#product_start_hour_4i').change(function() {
      isValidHour();
    });
    $('#product_start_hour_5i').change(function() {
      isValidHour();
    });
    $('#product_end_hour_4i').change(function() {
      isValidHour();
    });
    $('#product_end_hour_5i').change(function() {
      isValidHour();
    });
    $('.btn-back-to-shop').click(function(e) {
      e.preventDefault();
      $('#new-edit-product-modal').modal('hide');
    });
    $('.form-product input[type="submit"]').click(function(e) {
      if (!isValidHour()) {
        e.preventDefault();
      }
    });
  });

  $(document).on('click', '[data-destroy="product"]', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var product_name = $(this).data('product-name');
    swal({
      customClass: 'custom-swal',
      title: I18n.t('common.notifications'),
      text: I18n.t('confirm_delete_product', {product_name: product_name}),
      showCancelButton: true,
      confirmButtonColor: '#ff5722',
      confirmButtonText: I18n.t('submit'),
      cancelButtonText: I18n.t('cancel'),
      closeOnCancel: true
    }, function(confirmed) {
      if(confirmed) {
        $.ajax({
          url: url,
          type: "delete",
          dataType: "script"
        });
      }
    });
  });
});
$(document).on('keyup','.money',function(){
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40){
   event.preventDefault();
  }

  $(this).val(function(index, value) {
    value = value.replace(/,/g,'');
    return numberWithCommas(value);
  });
});

function numberWithCommas(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

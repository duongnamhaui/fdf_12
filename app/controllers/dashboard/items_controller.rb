class Dashboard::ItemsController < BaseDashboardController
  before_action :load_shop
  before_action :load_menu
  before_action :load_item

  def destroy
    @success = false
    if @item.destroy
      @success = true
    end
  end

  def edit;end

  def update
    @success = @item.update_attributes item_params
    respond_to do |format|
      format.js
    end
  end

  private

  def load_shop
    @shop = Shop.find_by slug: params[:shop_id]
    return if @shop
    respond_to do |format|
      format.js{render :destroy}
      format.html{rederiect_to root_path}
    end
  end

  def load_menu
    @menu = @shop.menus.find_by id: params[:menu_id]
    return if @menu
    respond_to do |format|
      format.js{render :destroy}
      format.html{rederiect_to root_path}
    end
  end

  def load_item
    @item = @menu.items.find_by id: params[:id]
    return if @item
    respond_to do |format|
      format.js{render :destroy}
      format.html{rederiect_to root_path}
    end
  end

  def item_params
    params.require(:item).permit :id, :name
  end
end

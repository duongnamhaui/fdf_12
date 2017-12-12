require "rails_helper"

RSpec.describe Dashboard::ItemsController, type: :controller do
  let(:user) {FactoryGirl.create(:user)}
  let(:domain) {FactoryGirl.create(:domain)}
  let!(:user_domain) {FactoryGirl.create(:user_domain, user: user, domain: domain)}
  let(:shop) {FactoryGirl.create(:shop, owner_id: user.id)}
  let(:menu) {FactoryGirl.create(:menu, shop_id: shop.id, user_id: shop.owner_id)}
  let(:item) {FactoryGirl.create(:item, menu_id: menu.id)}
  before {sign_in user}

  describe "#destroy" do
    context "destroy success" do
      before {delete :destroy, params: {shop_id: shop, menu_id: menu, id: item}, xhr: true}
      it "assigns @success" do
        expect(assigns(:success)).to eq true
      end
    end

    context "destroy fail" do
      before do
        allow_any_instance_of(Item).to receive(:destroy).and_return false
        delete :destroy, params: {shop_id: shop, menu_id: menu, id: item}, xhr: true
      end
      it "assigns @success" do
        expect(assigns(:success)).to eq false
      end
    end
  end
  describe "#edit" do
    context "edit success" do
      before {get :edit, params: {shop_id: shop, menu_id: menu, id: item}, xhr: true}
      it "assigns @item" do
        expect(assigns(:item)).to eq item
      end
    end

    context "edit fail" do
      before do
        get :edit, params: {shop_id: shop, menu_id: menu, id: 5}, xhr: true
      end
      it "assigns @item" do
        expect(assigns(:item)).to eq nil
      end
    end
  end

  describe "#update" do
    context "update success" do
      before do
        post :update, params: {shop_id: shop, menu_id: menu, id: item, item:{name: "new name"}}, xhr: true
      end
      it "assigns @item" do
        expect(assigns(:item).name).to eq "new name"
      end
      it "assigns @success" do
        expect(assigns(:success)).to eq true
      end
    end

    context "update fail" do
      before do
        post :update, params: {shop_id: shop, menu_id: menu, id: item, item:{name: ""}}, xhr: true
      end
      it "assigns @item" do
        expect(assigns(:item)).to eq item
      end
      it "assigns @success" do
        expect(assigns(:success)).to eq false
      end
    end
  end
end

require 'test_helper'

class SpielsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:spiels)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create spiel" do
    assert_difference('Spiel.count') do
      post :create, :spiel => { }
    end

    assert_redirected_to spiel_path(assigns(:spiel))
  end

  test "should show spiel" do
    get :show, :id => spiels(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => spiels(:one).to_param
    assert_response :success
  end

  test "should update spiel" do
    put :update, :id => spiels(:one).to_param, :spiel => { }
    assert_redirected_to spiel_path(assigns(:spiel))
  end

  test "should destroy spiel" do
    assert_difference('Spiel.count', -1) do
      delete :destroy, :id => spiels(:one).to_param
    end

    assert_redirected_to spiels_path
  end
end

require 'spec_helper'

describe "/homes/show.html.erb" do
  include HomesHelper
  before(:each) do
    assigns[:home] = @home = stub_model(Home,
      :version => "value for version"
    )
  end

  it "renders attributes in <p>" do
    render
    response.should have_text(/value\ for\ version/)
  end
end

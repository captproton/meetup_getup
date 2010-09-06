require 'spec_helper'

describe "/homes/new.html.erb" do
  include HomesHelper

  before(:each) do
    assigns[:home] = stub_model(Home,
      :new_record? => true,
      :version => "value for version"
    )
  end

  it "renders new home form" do
    render

    response.should have_tag("form[action=?][method=post]", homes_path) do
      with_tag("input#home_version[name=?]", "home[version]")
    end
  end
end

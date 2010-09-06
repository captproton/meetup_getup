require 'spec_helper'

describe "/homes/edit.html.erb" do
  include HomesHelper

  before(:each) do
    assigns[:home] = @home = stub_model(Home,
      :new_record? => false,
      :version => "value for version"
    )
  end

  it "renders the edit home form" do
    render

    response.should have_tag("form[action=#{home_path(@home)}][method=post]") do
      with_tag('input#home_version[name=?]', "home[version]")
    end
  end
end

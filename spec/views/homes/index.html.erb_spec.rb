require 'spec_helper'

describe "/homes/index.html.erb" do
  include HomesHelper

  before(:each) do
    assigns[:homes] = [
      stub_model(Home,
        :version => "value for version"
      ),
      stub_model(Home,
        :version => "value for version"
      )
    ]
  end

  it "renders a list of homes" do
    render
    response.should have_tag("tr>td", "value for version".to_s, 2)
  end
end

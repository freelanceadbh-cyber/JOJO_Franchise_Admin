import re
import os

html_block = """
            <!-- Regular Category -->
            <div class="flavor-category" style="margin-top: 2rem;">
                <h3 class="category-title" style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--dark-text);">Regular</h3>
                <div class="flavors-grid">
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Vannila.jpeg" alt="Vanilla Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">VANILLA</div>
                            <div class="flavor-description">Classic vanilla milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹89</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Strawberry.jpeg" alt="Strawberry Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">STRAWBERRY</div>
                            <div class="flavor-description">Fresh strawberry milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹89</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Vannila chocoship.jpeg" alt="Vanilla Choco Chip Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">VANILLA CHOCO CHIP</div>
                            <div class="flavor-description">Vanilla choco chip milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹89</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Classic Category -->
            <div class="flavor-category" style="margin-top: 2rem;">
                <h3 class="category-title" style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--dark-text);">Classic</h3>
                <div class="flavors-grid">
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}buttercotch.jpeg" alt="Butterscotch Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BUTTERSCOTCH</div>
                            <div class="flavor-description">Rich butterscotch milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹99</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Blackcurrent.jpeg" alt="Black Currant Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BLACK CURRANT</div>
                            <div class="flavor-description">Tangy black currant milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹99</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}kulfi malai.jpeg" alt="Kulfi Malai Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">KULFI MALAI</div>
                            <div class="flavor-description">Traditional kulfi milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹99</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Pista.jpeg" alt="Pista Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">PISTA</div>
                            <div class="flavor-description">Pistachio delight milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹99</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Chocolate.jpeg" alt="Chocolate Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">CHOCOLATE</div>
                            <div class="flavor-description">Rich chocolate milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹99</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Special Category -->
            <div class="flavor-category" style="margin-top: 2rem;">
                <h3 class="category-title" style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--dark-text);">Special</h3>
                <div class="flavors-grid">
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Black Forest.jpeg" alt="Black Forest Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BLACK FOREST</div>
                            <div class="flavor-description">Black forest cake milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}oreo Freak.jpeg" alt="Oreo Freak Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">OREO FREAK</div>
                            <div class="flavor-description">Oreo cookie milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}spanish delight.jpeg" alt="Spanish Delight Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">SPANISH DELIGHT</div>
                            <div class="flavor-description">Spanish delight milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Salted Caramel.jpeg" alt="Salted Caramel Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">SALTED CARAMEL</div>
                            <div class="flavor-description">Salted caramel milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}basunthi.jpeg" alt="Basundhi Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BASUNDHI</div>
                            <div class="flavor-description">Traditional basundhi milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Tiramisu.jpeg" alt="Tiramisu Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">TIRAMISU</div>
                            <div class="flavor-description">Italian tiramisu milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Chocolate.jpeg" alt="Chocolate Brownie Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">CHOCOLATE BROWNIE</div>
                            <div class="flavor-description">Chocolate brownie milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Red Velvet.jpeg" alt="Red Velvet Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">RED VELVET</div>
                            <div class="flavor-description">Red velvet cake milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}cookies and cream.jpeg" alt="Cookies and Cream Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">COOKIES & CREAM</div>
                            <div class="flavor-description">Cookies & cream milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Rajbhog.jpeg" alt="Rajbhog Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">RAJBHOG</div>
                            <div class="flavor-description">Royal rajbhog milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}cotton candy.jpeg" alt="Cotton Candy Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">COTTON CANDY</div>
                            <div class="flavor-description">Cotton candy milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}fig and honey.jpeg" alt="Fig and Honey Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">FIG & HONEY</div>
                            <div class="flavor-description">Fig & honey milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹129</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Natural Category -->
            <div class="flavor-category" style="margin-top: 2rem;">
                <h3 class="category-title" style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--dark-text);">Natural</h3>
                <div class="flavors-grid">
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Jackfruit.jpeg" alt="Jackfruit Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">JACKFRUIT</div>
                            <div class="flavor-description">Tropical jackfruit milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Tender coconut.jpeg" alt="Tender Coconut Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">TENDER COCONUT</div>
                            <div class="flavor-description">Fresh tender coconut milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Meethapaan.jpeg" alt="Meethapaan Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">MEETHAPAAN</div>
                            <div class="flavor-description">Traditional meethapaan milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Gulkand.jpeg" alt="Gulkand Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">GULKAND</div>
                            <div class="flavor-description">Rose petal gulkand milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Arabian Dates.jpeg" alt="Arabian Dates Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">ARABIAN DATES</div>
                            <div class="flavor-description">Premium dates milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Berry Blast.jpeg" alt="Berry Blast Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BERRY BLAST</div>
                            <div class="flavor-description">Mixed berry milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Berrylicious.jpeg" alt="Berrylicious Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BERRYLICIOUS</div>
                            <div class="flavor-description">Berrylicious milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Blueberry.jpeg" alt="Blue Berry Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">BLUE BERRY</div>
                            <div class="flavor-description">Blueberry milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Pink Guava.jpeg" alt="Pink Guava Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">PINK GUAVA</div>
                            <div class="flavor-description">Pink guava milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}alphanso mango.jpeg" alt="Alphonso Mango Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">ALPHONSO MANGO</div>
                            <div class="flavor-description">Alphonso mango milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹119</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Exotic Category -->
            <div class="flavor-category" style="margin-top: 2rem;">
                <h3 class="category-title" style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--dark-text);">Exotic</h3>
                <div class="flavors-grid">
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}choco Almond Fudge.jpeg" alt="Choco Almond Fudge Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">CHOCO ALMOND FUDGE</div>
                            <div class="flavor-description">Choco almond fudge milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹149</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Chocolate Bourbon.jpeg" alt="Chocolate Bourbon Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">CHOCOLATE BOURBON</div>
                            <div class="flavor-description">Chocolate bourbon milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹149</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Red Wine Berry.jpeg" alt="Red Wine Berry Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">RED WINE BERRY</div>
                            <div class="flavor-description">Red wine berry milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹149</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}Hazelnut Nutella.jpeg" alt="Hazelnut Nutella Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">HAZELNUT NUTELLA</div>
                            <div class="flavor-description">Hazelnut nutella milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹149</span></div>
                        </div>
                    </div>
                    <div class="flavor-card scroll-reveal">
                        <div class="flavor-image"><img src="{img_prefix}coffee Almond fudge.jpeg" alt="Coffee Almond Fudge Milkshake" onerror="this.src='{img_prefix}Vannila.jpeg'"></div>
                        <div class="flavor-info">
                            <div class="flavor-name">COFFEE ALMOND FUDGE</div>
                            <div class="flavor-description">Coffee almond fudge milkshake</div>
                            <div class="flavor-footer"><span class="flavor-price">₹149</span></div>
                        </div>
                    </div>
                </div>
            </div>
"""

def update_file(filepath, img_prefix):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the milkshakes category grid and replace its contents
    start_tag = '<!-- Add milkshake items here -->'
    
    if start_tag in content:
        content = content.replace(start_tag, html_block.format(img_prefix=img_prefix))
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"Could not find start tag in {filepath}")

update_file(r'd:\Jojo ice cream\index.html', 'images/milkshakes/')
update_file(r'd:\Jojo ice cream\Ice-cream-Shop\index.html', 'assets/images/milkshakes/')

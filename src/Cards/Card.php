<?php

namespace Appstract\NovaHorizon\Cards;

use Laravel\Nova\Card as NovaCard;

class Card extends NovaCard
{
    /**
     * The width of the card (1/3, 1/2, or full).
     *
     * @var string
     */
    public $width = '1/4';
}

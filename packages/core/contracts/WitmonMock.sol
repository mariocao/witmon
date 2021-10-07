// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/WitmonDecoratorBase.sol";
import "../contracts/interfaces/IWitmonEvents.sol";
import "../contracts/interfaces/IWitmonSurrogates.sol";
import "../contracts/libs/Witmons.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract WitmonMock is IWitmonSurrogates, IWitmonEvents {
    using Counters for Counters.Counter;
    using Witmons for Witmons.State;

    Witmons.State internal _state;

    constructor(
            address _signator, // public key of backend server
            uint256 _totalEggs
        )
    {
        _state.params.signator = _signator;
        _state.params.totalEggs = _totalEggs;
    }

    function mintCreature(
            address _eggOwner,
            uint256 _eggIndex,
            uint256 _eggColorIndex,
            uint256 _eggScore,
            uint256 _eggRanking, // 1..totalEggs
            bytes calldata _signature
        )
        external
        override
    {
        // Verify signator:
        bytes32 _eggHash = keccak256(abi.encodePacked(
            _eggOwner,
            _eggIndex,
            _eggRanking,
            _state.params.totalEggs
        ));
        require(
            Witmons.recoverAddr(_eggHash, _signature) == _state.params.signator,
            "WitmonERC721: bad signature"
        );

        // // Verify not already minted:
        // require(
        //     _state.creatures[_eggIndex].tokenId == 0,
        //     "WitmonERC721: already minted"
        // );

        // Verify egg index range:
        require(
            _eggIndex < _state.params.totalEggs,
            "WitmonERC721: bad index"
        );

        // Increment token supply:
        _state.totalSupply.increment();
        uint256 _tokenId = _state.totalSupply.current();

        // // Fulfill creature data:
        // uint256 _totalEggs = _state.params.totalEggs;
        // uint8 _percentile100 = _eggRanking > _totalEggs ? uint8(1) : uint8((_eggRanking * 100) / _totalEggs);
        // Witmons.Creature memory _creature = Witmons.Creature({
        //     tokenId: _tokenId,
        //     eggBirth: block.number,
        //     eggCategory: _state.creatureCategory(_percentile100),
        //     eggColorIndex: _eggColorIndex,
        //     eggIndex: _eggIndex,
        //     eggScore: _eggScore,
        //     eggRanking: _eggRanking,
        //     eggPhenotype: keccak256(abi.encodePacked(
        //         _signature,
        //         _state.witnetRandomness
        //     ))
        // });
        // _state.creatures[_eggIndex] = _creature;		
        // _state.eggIndex_[_tokenId] = _eggIndex;

        // // Mint the token:
        // _safeMint(_eggOwner, _tokenId);
        emit NewCreature(_eggIndex, _tokenId);
    }

}